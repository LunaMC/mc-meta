var fs = require('fs');
var os = require('os');
var request = require('request');
var cheerio = require('cheerio');
var xmlBuilder = require('xmlbuilder');

request('http://wiki.vg/index.php?title=Protocol_version_numbers', function(err, response, body) {
    var $ = cheerio.load(body);

    var header = $('h2:contains("Versions after the Netty rewrite")');
    if (header.length < 1) {
        console.error('Doesn\'t found h2 "Versions after the Netty rewrite"');
        process.exit(1);
        return;
    }

    var table = header.nextAll('table').first();
    if (table.length < 1) {
        console.error('Doesn\'t found table after header');
        process.exit(1);
        return;
    }

    var element, temp, first, second, version, type;
    var result = [];
    table.find('tr').each(function(index) {
        element = $(this);
        temp = element.find('td, th');
        first = temp.eq(0).text().trim().toLowerCase();
        second = temp.eq(1).text().trim().toLowerCase();

        // Validate first row
        if (index === 0) {
            if (first !== 'release name' || second !== 'version number') {
                console.error('Invalid tables columns: ' + first + ', ' + second);
                process.exit(1);
            }
        } else {
            if (/^[0-9]+w[0-9]+[a-z]*$/.test(first)) {
                type = 'SNAPSHOT';
            } else if (/^[0-9]+\.[0-9]+(\.[0-9]+)?-pre[0-9]*$/.test(first)) {
                type = 'PRE_RELEASE';
            } else if  (/^[0-9]+\.[0-9]+(\.[0-9]+)?$/.test(first)) {
                type = 'RELEASE';
            } else if (first === '1.rv-pre1') {
                type = 'JOKE';
            } else {
                console.warn('Unknown version expression: ' + first);
                return;
            }

            if (second.length > 0)
                version = second;

            result.push({
                version_name: first,
                version_type: type,
                protocol_version: parseInt(version)
            });
        }
    });

    if (result.length < 1) {
        console.error('No data parsed');
        process.exit(1);
        return;
    }

    writeResult(result);
});

function writeResult(data) {
    if (!fs.existsSync('target'))
        fs.mkdirSync('target');

    if (fs.existsSync('target/versions.json'))
        fs.truncateSync('target/versions.json', 0);
    fs.writeFileSync('target/versions.json', JSON.stringify(data, null, 2) + os.EOL);

    if (fs.existsSync('target/versions.xml'))
        fs.truncateSync('target/versions.xml', 0);
    fs.writeFileSync('target/versions.xml', createXml(data) + os.EOL);
}

function createXml(data) {
    var builder = xmlBuilder.create('minecraftVersions');
    var current;
    for (var i = 0; i < data.length; i++) {
        current = data[i];
        builder.ele('minecraftVersion', {
            versionName: current.version_name,
            versionType: current.version_type,
            protocolVersion: current.protocol_version
        });
    }
    return builder.end({ pretty: true });
}

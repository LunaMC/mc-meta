# mc-meta [![Build Status](https://travis-ci.org/LunaMC/mc-meta.svg?branch=master)](https://travis-ci.org/LunaMC/mc-meta)

## versions.{xml,json}

**Source:** http://wiki.vg/index.php?title=Protocol_version_numbers (Section *"Versions after the Netty rewrite"*)

**Schema:**

 * `versionName` (xml) or `version_name` (json): The name of the release (lowercase)
 * `versionType` (xml) or `version_type` (json): The type of the release (possible values: `SNAPSHOT`, `PRE_RELEASE`,
   `RELEASE` and `JOKE`)
 * `protocolVersion` (xml) or `protocol_version` (json): The protocol version used by the release

## Update

To update the repository just run `npm run start`

This repository should be updated automatically by a [TravisCI Cron Job](https://travis-ci.org/LunaMC/mc-meta).

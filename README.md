# Introduction

Wazimap-NG is the next version of [Wazimap](http://www.wazimap.co.za). It provides a platform for users to bind tabular data to spatial boundaries in order create curated views of datasets. Yes - that's probably too vague a description to understand what it is. Hopefully the images below provide a better description:

<a href="https://postimg.cc/G8XkZRhV" target="_blank"><img src="https://i.postimg.cc/G8XkZRhV/Screen-Shot-2020-09-27-at-09-50-00.png" alt="Screen-Shot-2020-09-27-at-09-50-00"/></a> <a href="https://postimg.cc/MM67PHx1" target="_blank"><img src="https://i.postimg.cc/MM67PHx1/Screen-Shot-2020-09-27-at-09-50-33.png" alt="Screen-Shot-2020-09-27-at-09-50-33"/></a><br/><br/>
<a href="https://postimg.cc/4HnzG0Yd" target="_blank"><img src="https://i.postimg.cc/4HnzG0Yd/Screen-Shot-2020-09-27-at-09-50-50.png" alt="Screen-Shot-2020-09-27-at-09-50-50"/></a> <a href="https://postimg.cc/MXsDL7nH" target="_blank"><img src="https://i.postimg.cc/MXsDL7nH/Screen-Shot-2020-09-27-at-09-51-30.png" alt="Screen-Shot-2020-09-27-at-09-51-30"/></a><br/><br/>

See a link to the beta site here: [https://beta.youthexplorer.org.za](https://beta.youthexplorer.org.za).

You can find the frontend code in this repository. The backend is available here: [https://github.com/openupsa/wazimap-ng](https://github.com/openupsa/wazimap-ng).

# Development

Import Webflow exports using [import-webflow-export](https://www.npmjs.com/package/import-webflow-export)


# New features

The main new features are:

* Admins now have more flexibility when it comes to loading data. This includes uploading massive datasets and then slicing and dicing in the backend rather than pre-preparing datasets beforehand.
* Point data is now fully integrated as a first-class spatial object.
* Choropleths built into the main view. These were hidden behind multiple clicks in the previous version.
* One platform can host multiple profiles off the same database.
* The Rich data view allows richer disaggregation of indicators.
* The administrator can configure the view to use custom basemaps, colours, and other UI settings.
* Arbitrary spatial boundaries and hierarchies can be loaded onto the same server.
* Toggling of overlapping boundary layers such as switching between wards and mainplaces which typically cover the same areas.
* Integration into third-party data sources for realtime data feeds.

# Related software
There is no shortage of mapping software available, both commerical and open-source. Wazimap focuses on providing a platform for data custodians to showcase their datasets and mashing them up with public data. The most similar tool that we have found is the excellent [GeoNode](https://geonode.org/). We feel that approach to publishing data is significantly different enough to warrant a separate project.

# Installation

Requires: NodeJS 20.x.


```bash
yarn install
yarn start
```

# Other commands
```bash
yarn build # compile the relevant bundles for production
```

## Configuration

The build is configured using environment variables.

These could be defined in a .env file in the root directory, or on the command line, e.g. for development

```
HOSTNAME=youthexplorer.org.za yarn start`
```

| Variable                | Default                              | Description                                                                                                       |
| ----------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| HOSTNAME                | unset                                | If set, overrides using the hostname in the address bar to determine the profile being requested. e.g. `youthexplorer.org.za` |
| API_URL                 | unset                                | If set, overrides the default production and staging backend URLs. e.g. `https://api.wazimap.com`|
| ENVIRONMENT             | unset                                | E.g. `production`, `staging`, `sandbox`|
| SENTRY_DSN              | unset                                | Required in production, staging and sandbox environment                                                           |
| GOOGLE_ANALYTICS_ID     | unset                                | ID for Google Analytics. Usually only required in production environment                                                |


## Known Issues
There is an issue with the parcel bundler that sometimes comes up. The easiest way to solve this is to delete the `.cache` folder.

# Documentation
These are works in progress:

* [Technical manual](https://openup.gitbook.io/wazi-ng-technical/)
* [Administrator manual](https://openup.gitbook.io/wazimap-ng/)

# Contributions
Contributions are welcome - we are working towards making this process easier.

# Shoulders of giants
This project is the next iteration of a number of excellent projects starting with [CensusReporter](https://censusreporter.org/) and [Wazimap](http://www.wazimap.co.za) that followed it. Special thanks to William Bird from [Media Monitoring Africa](https://mediamonitoringafrica.org) whose initial idea (and funding) it was to build a tool to help journalists better understand areas they were reporting on. Also thanks to Chris Berens from [VPUU](vpuu.org.za) who directed funding to help kickstart this new build. Finally, all of the amazing spatial software and tools developed by one of the most dedicated open source communities out there.

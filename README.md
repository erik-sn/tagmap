# Tagmap

This application is designed to inspect an [OSISoft PI data archive](https://techsupport.osisoft.com/products/pi-server/pi-data-archive/overview/) and provide insight into the connections within it. Specifically this targets the
performance equations and the relationships between them.



### Performance Equations

A tag represents a single value - steam temperature at a location, the speed of a motor,
the pressure of a boiler, etc. 

Performance equations are compositions of tags (or other performance equations). For example if a machine has 3 "sections", the total machine
efficiency is the average of each section:

```python
    MCH01_EFFICIENCY = ('MCH01_SECTION01_EFFICIENCY' + 'MCH01_SECTION02_EFFICIENCY' +'MCH01_SECTION03_EFFICIENCY') / 3
```

In large PI systems (hundreds of thousands, millions of tags) these equations begin to interconnect and form veritable webs
of dependencies, analogous to [Spaghetti Code](https://en.wikipedia.org/wiki/Spaghetti_code). This application seeks to analyze,
describe and visualize these depenencies:

<img src="http://res.cloudinary.com/dvr87tqip/image/upload/v1493901490/tagmap_cdor0w.png" alt="Family Tree" width="500px" />


### Installation

This application requires python >=3.4 to be installed on the machine. To install simply `git clone` or download this repository
and run the following commands in the application directory:

```bash
pip install -r requirements.txt  # install python dependencies
python manage.py migrate  # set up sqlite3 database
python manage.py runserver  # start server
```

This is not designed for large scale production use - if this is required I suggest hosting behind a web server.


### Usage

A description of how to use this application can be found in the "Usage" menu located on the Navbar


### Tests

To run javascript tests:

```bash
cd js
npm t
```

To run python/django tests:
```bash
python manage.py test --settings=config.test_settings
```

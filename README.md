# jekyll-reflection
A progressive Jekyll theme that supports the best web practices possible to build a single page resume

# Features
* Perfect 100 out of the box for google lighthouse auditing
* Massive browser & nojs support
* Service worker installation to efficiently cache, with intelligent cache / network fallback choices.
* Modern image serving (high resolution lazy load + low resolution eager load)
* Runtime responsive image generation
* Sleek design
* Easy to deploy with services like Github Pages or AWS

# Paradigms
* Aided by js and browser support BUT NOT COMPRIMISED without such comforts
* Up to code with ALL PWA STANDARDS
* Must look exactly as envisioned, due to difficulty with #1 or #2\
^Literally anything is possible with #1 and #2 if you put your mind to it

# Dependencies
This theme is supported by jquery, bootstrap, lazysizes, jekyll-assets, and imagemagick

# Installation
* Fork & clone the repo ( maybe star too ;) )
* Install imagemagick and associated libraries (libpng, libwebp, any others you might want too)  
https://imagemagick.org/index.php
* bundle install && bundle exec jekyll serve

# Navigating the Theme
Jekyll Reflection uses a fairly intuitive asset layout  
The site by default builds into the /docs folder  
\_pages contains root html / manifest files  
\_layouts contains layouts  
\_includes contains partials, grouped in subfolders based on the page they are used in (or global, for shared use)  
\_data contains yml files for styling the theme and dynamically expanding your project / about sections  
\_assets contians assets, also grouped by page  

# Making it Your Own
This asset layout and theme management was chosen so you can create anything you image  
Try your best to stick to using jekyll-assets / the \_lazy_image.html file for any assets you choose to use  
Avoid writing complex css, bootstrap probably has a class for the stylings you will include  
Keep the JS light, and make sure the site still works without it  
Use sites like caniusethat to confirm feature support for anything you build

# Deployment
When deploying to github pages, simply build the site locally in production mode, and push the /docs folder against your pages repository. Feel free to consider a CI to automate this proceedure for you.\
\
AWS also has great hosting options (and their free tier will almost certainly cover a small site). AWS Amplify, or simply EC2 + Cloudfront can be deployed in minutes. You will see large benefits from having proper cache control and a CDN. Provide them a custom docker image with the required imagemagick dependency to dynamically build your assets.

```
## Install ImageMagick
RUN yum install -y libtool-ltdl libjpeg libjpeg-devel libpng libpng-devel libtiff libtiff-devel libwebp libwebp-devel LibRaw LibRaw-devel jxrlib git make automake gcc pkgconf && \
    git clone https://github.com/ImageMagick/ImageMagick.git && \
    cd ImageMagick && git checkout 7.0.8-40 && \
    ./configure && make && make install && \
    cd ../ && \
    rm -rf ./ImageMagick && \
    yum remove -y git make automake gcc libjpeg-devel libpng-devel libtiff-devel libwebp-devel LibRaw-devel && \
    yum clean all
```


# todo:
Background image css files need manual modification when someone edits the jekyll theme, need to find a better way\
\
Get service worker to cache everything on the very first page load with no overhead\
\
Figure out a clean way to minify the serviceworker.js (and perhaps html too since were static serving!) without comprimising the layout of our directory\
\
Move the browserconfig.xml and site.webmanifest out from pages, but while still placing them on root after compilation\
\
Use NPM for vendor assets instead of hard-copying them

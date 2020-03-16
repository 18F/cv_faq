FROM ruby:2.5.7
ENV LC_ALL=C.UTF-8

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install nodejs -y

COPY Gemfile* /app/
COPY package*.json /app/

WORKDIR /app

RUN bundle install
RUN npm ci

CMD bundle exec jekyll serve --host 0.0.0.0

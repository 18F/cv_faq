FROM ruby:2.6.6-stretch
ENV LC_ALL=C.UTF-8

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install nodejs -y

COPY Gemfile* /app/
COPY package*.json /app/

WORKDIR /app

RUN bundle install
RUN npm install

CMD npm start

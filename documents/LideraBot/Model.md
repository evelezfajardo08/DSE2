// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs


Table bots {
  id integer [pk]
  name varchar(100)
  version varchar(20)
  description text
  status varchar(20)
  created_at date
}

Table users {
  id integer [pk]
  name varchar(100)
  email varchar(100)
  password varchar(100)
  role varchar(50)
  registered_at date
  status varchar(20)
}

Table conversations {
  id integer [pk]
  user_id integer
  bot_id integer
  start_date timestamp
  end_date timestamp
}

Table messages {
  id integer [pk]
  conversation_id integer
  sender varchar(50)
  content text
  sent_at timestamp
}

Table modules {
  id integer [pk]
  name varchar(100)
  description text
  level varchar(50)
  status varchar(20)
}

Table progress {
  id integer [pk]
  user_id integer
  module_id integer
  percentage decimal(5,2)
  status varchar(20)
}

Table assessments {
  id integer [pk]
  module_id integer
  title varchar(100)
  type varchar(50)
  max_score integer
  content_id integer
}

Table contents {
  id integer [pk]
  module_id integer
  type varchar(50)
  title varchar(100)
  description text
  resource_url varchar(200)
}

Table results {
  id integer [pk]
  user_id integer
  evaluation_id integer
  score decimal(5,2)
  evaluation_date date
}

/* Relationships */

Ref: conversations.user_id > users.id
Ref: conversations.bot_id > bots.id

Ref: messages.conversation_id > conversations.id

Ref: progress.user_id > users.id
Ref: progress.module_id > modules.id

Ref: contents.module_id > modules.id

Ref: assessments.module_id > modules.id
Ref: assessments.content_id > contents.id

Ref: results.user_id > users.id
Ref: results.evaluation_id > assessments.id

variable "prefix" {
  description = "Resource name prefix"
}

variable "location" {
  description = "Azure region"
}

variable "resource_group_name" {
  description = "Resource group name"
}

variable "bot_tier" {
  description = "Chatbot application service plan tier (Free, Shared, Standard)"
}

variable "bot_size" {
  description = "Chatbot application size (F1, D1, S1)"
}

variable "bot_sku" {
  description = "Chatbot application sku (F0, S1)"
}

variable "knowledge_base_id" {
  description = "QnAMaker knowledge base ID"
}

variable "qna_auth_key" {
  description = "QnAMaker authentication key"
}

variable "qna_endpoint_host_name" {
  description = "QnAMaker endpoint host name"
}

variable "prefix" {
  description = "Resource name prefix"
}

variable "location" {
  description = "Azure region"
}

variable "resource_group_name" {
  description = "Resource group name"
}

variable "search_service_sku" {
  description = "Pricing SKU for the Search Service."
  default     = "Standard"
}

variable "cognitive_account_sku" {
  default     = "S0"
  description = "Pricing SKU for the Cognitive Account."
}

variable "qna_sku_tier" {
  default     = "free"
  description = "Application service plan pricing tier. (Free, Shared, Standard)"
}

variable "qna_sku_name" {
  default     = "F1"
  description = "QnA service size. (F1, D1, S1)"
}

variable "knowledge_base_source_file" {
  description = "Knowledge Base source file to use."
}

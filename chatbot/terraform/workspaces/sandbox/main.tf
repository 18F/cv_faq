variable "location" {
  default = "westus"
}

provider "azurerm" {
  #version = "~> 2.3.0"
  version = "~> 2.20.0"
  #version = "~> 2.24.0"
  features {}
}

locals {
  project_name  = "cv-faq"
  environment   = "sandbox"
  language_code = "en"
  prefix        = "${local.project_name}-${local.environment}-chatbot-${local.language_code}"
}

# terraform {
#   backend "azurerm" {
#     resource_group_name  = "StorageAccount-ResourceGroup"
#     storage_account_name = "abcd1234"
#     container_name       = "tfstate"
#     key                  = "prod.terraform.tfstate"
#   }
# }

# Create a virtual network within the resource group
# resource "azurerm_virtual_network" "chatbot" {
#   name                = "chatbot-network"
#   resource_group_name = azurerm_resource_group.rg.name
#   location            = azurerm_resource_group.chatbot.location
#   address_space       = ["10.0.0.0/16"]
# }

resource "azurerm_resource_group" "rg" {
  name     = "${local.prefix}-rg"
  location = var.location
}

module "knowledge_base" {
  source                     = "../../modules/knowledge-base"
  prefix                     = local.prefix
  resource_group_name        = azurerm_resource_group.rg.name
  location                   = var.location
  qna_sku_tier               = "Standard"
  qna_sku_name               = "S2"
  cognitive_account_sku      = "S2"
  search_service_sku         = "Standard"
  knowledge_base_source_file = "../../../../_site/knowledge-base.json"
}

module "chatbot" {
  source                     = "../../modules/chatbot"
  prefix                     = local.prefix
  resource_group_name        = azurerm_resource_group.rg.name
  location                   = var.location

  bot_tier                   = "Standard"
  bot_size                   = "S1"
  bot_sku                    = "S1"

  # manually set to workaround knowledge base creation bug
  # set in local terraform.tfvars file
  knowledge_base_id          = var.knowledge_base_id
  qna_auth_key               = var.qna_auth_key
  qna_endpoint_host_name     = var.qna_endpoint_host_name
}

output "qnamaker_name" {
  value = module.knowledge_base.qnamaker_name
}

output "qnamaker_access_key" {
  value = module.knowledge_base.qnamaker_access_key
}

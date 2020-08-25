resource "azuread_application" "chatbot_app" {
  name                       = "${var.prefix}-app"
  oauth2_permissions         = []
  oauth2_allow_implicit_flow = false
  reply_urls                 = null
}

output "MicrosoftAppId" {
  value = "${azuread_application.chatbot_app.application_id}"
}

# Generate random string to be used for Service Principal password
resource "random_string" "password" {
  length  = 32
  special = true
}

resource "azuread_application_password" "chatbot_app_password" {
  application_object_id = azuread_application.chatbot_app.id
  value                 = random_string.password.result
  end_date              = "2099-01-01T01:02:03Z"
}

output "MicrosoftAppPassword" {
  value = "${azuread_application_password.chatbot_app_password.value}"
}

resource "azurerm_app_service_plan" "chatbot_app_service_plan" {
  name                = "${var.prefix}-app-service-plan"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku {
    tier = var.bot_tier
    size = var.bot_size
  }
}

resource "azurerm_application_insights" "chatbot_app_insights" {
  name                = "${var.prefix}-app-appi"
  location            = var.location
  resource_group_name = var.resource_group_name
  application_type    = "web"
}

data "template_file" "webapp_template" {
  template = file("${path.module}/web_app.json")
}

resource "azurerm_template_deployment" "chatbot_app_service" {
  name                = var.prefix
  resource_group_name = var.resource_group_name
  template_body       = data.template_file.webapp_template.rendered
  parameters = {
    "location"            = var.location
    "kind"                = "bot"
    "siteName"            = "${var.prefix}-svc"
    "appId"               = azuread_application.chatbot_app.application_id
    "appSecret"           = azuread_application_password.chatbot_app_password.value
    #"zipUrl"              = "${var.zipUrl}"
    "serverFarmId"        = azurerm_app_service_plan.chatbot_app_service_plan.id
    "QnAKnowledgebaseId"  = var.knowledge_base_id
    "QnAAuthKey"          = var.qna_auth_key
    "QnAEndpointHostName" = var.qna_endpoint_host_name
  }
  deployment_mode = "Incremental" # Deployment => incremental (complete is too destructive in our case)

}

//Left in for not incase at a future date they support the kind parameter
# resource "azurerm_app_service" "Chatbot-app-svc" {
#   name                = "${var.prefix}-svc"
#   location            = var.location
#   resource_group_name = var.resourceGroupName
#   app_service_plan_id = azurerm_app_service_plan.Chatbot-serviceplan.id

#   site_config {
#     dotnet_framework_version = "v4.0"
#     cors {
#       allowed_origins = [
#         "https://portal.azure.com",
#         "https://botservice.hosting.portal.azure.net",
#         "https://botservice-ms.hosting.portal.azure.net",
#         "https://hosting.onecloud.azure-test.net/"
#       ]
#     }
#     websockets_enabled = true
#   }

#   app_settings = {
#      "WEBSITE_NODE_DEFAULT_VERSION" = "10.14.1"
#      "MicrosoftAppId": azuread_application.Chatbot-adapp.application_id
#      "MicrosoftAppPassword": azuread_application_password.Chatbot-adapp-password.value
#      "QnAKnowledgebaseId": replace(var.QnAKnowledgebaseId, "//knowledgebases//","")
#      "QnAAuthKey": var.QnAAuthKey
#      "QnAEndpointHostName": var.QnAEndpointHostName
#   }

#   depends_on = [
#       azurerm_app_service_plan.Chatbot-serviceplan, azuread_application_password.Chatbot-adapp-password
#   ]
# }

resource "azurerm_bot_web_app" "chatbot_app" {
  name                                  = "${var.prefix}-bot-web-app"
  location                              = var.location
  resource_group_name                   = var.resource_group_name
  sku                                   = var.bot_sku
  microsoft_app_id                      = azuread_application.chatbot_app.application_id
  developer_app_insights_key            = azurerm_application_insights.chatbot_app_insights.instrumentation_key
  developer_app_insights_application_id = azurerm_application_insights.chatbot_app_insights.app_id
  endpoint                              = "https://${var.prefix}.azurewebsites.net/api/messages"
}

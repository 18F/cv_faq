resource "random_uuid" "uuid" {}

locals {
  filepath     = "${path.module}/tmp/${var.prefix}.${random_uuid.uuid.result}"
  filepath_key = "${path.module}/tmp/${var.prefix}-key.${random_uuid.uuid.result}"
}

data "azurerm_client_config" "current" {}

resource "azurerm_app_service_plan" "service_plan" {
  name                = "${var.prefix}-service-plan"
  location            = var.location
  kind                = "app"
  resource_group_name = var.resource_group_name
  sku {
    tier = var.qna_sku_tier
    size = var.qna_sku_name
  }
}

resource "azurerm_application_insights" "chatbot_insights" {
  name                = "${var.prefix}-application-insights"
  location            = var.location
  resource_group_name = var.resource_group_name
  application_type    = "web"
}

resource "random_string" "random" {
  length  = 12
  special = false
  lower   = true
  upper   = false
}

resource "azurerm_search_service" "search_service" {
  name                = "${var.prefix}-search-service-${random_string.random.result}"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = lower(var.search_service_sku)
}

resource "azurerm_app_service" "app_service" {
  name                = "${var.prefix}-app-service"
  location            = var.location
  resource_group_name = var.resource_group_name
  app_service_plan_id = azurerm_app_service_plan.service_plan.id

  site_config {
    dotnet_framework_version = "v4.0"
    cors {
      allowed_origins = ["*"]
    }
    use_32_bit_worker_process = var.qna_sku_tier == "Standard" ? false : true
    #use_32_bit_worker_process = var.qna_sku_tier != "standard"
  }

  app_settings = {
    "AzureSearchAdminKey"        = azurerm_search_service.search_service.primary_key
    "UserAppInsightsKey"         = azurerm_application_insights.chatbot_insights.instrumentation_key
    "UserAppInsightsName"        = azurerm_application_insights.chatbot_insights.name
    "UserAppInsightsAppId"       = azurerm_application_insights.chatbot_insights.app_id
    "PrimaryEndpointKey"         = "${var.prefix}-primary-endpoint-key"
    "SecondaryEndpointKey"       = "${var.prefix}-secondary-endpoint-key"
    "DefaultAnswer"              = "No good match found in knowledge base."
    "QNAMAKER_EXTENSION_VERSION" = "latest"
  }

  depends_on = [
    azurerm_application_insights.chatbot_insights,
    azurerm_app_service_plan.service_plan,
    azurerm_search_service.search_service
  ]
}

resource "azurerm_cognitive_account" "qnamaker" {
  name = "${var.prefix}-cognitive-account-qnamaker"
  #location            = "global"
  location            = var.location
  resource_group_name = var.resource_group_name
  kind                = "QnAMaker"
  sku_name            = var.cognitive_account_sku
  # Terraform crashes if this is not set
  qna_runtime_endpoint = "https://${azurerm_app_service.app_service.default_site_hostname}"
  depends_on = [
    azurerm_app_service.app_service
  ]
}


# resource "null_resource" "knowledge_base" {
#   provisioner "local-exec" {
#     command = <<EOT
#       python3 ../../bin/publish_knowledge_base.py \
#         --app-service-name ${azurerm_app_service.app_service.name} \
#         --source-file "${var.knowledge_base_source_file}" \
#         --endpoint ${azurerm_cognitive_account.qnamaker.endpoint} \
#         --access-key ${azurerm_cognitive_account.qnamaker.primary_access_key}
#     EOT
#   }
#   # provisioner "local-exec" {
#   #   when        = destroy
#   #   command     = <<EOT
#   #     python3 ../../bin/destroy_knowledge_base.py \
#   #       --app-service-name ${azurerm_app_service.app_service.name} \
#   #       --endpoint ${azurerm_cognitive_account.qnamaker.endpoint} \
#   #       --access-key ${azurerm_cognitive_account.qnamaker.primary_access_key}
#   #   EOT
#   # }
#   triggers = {
#     "before" = "${azurerm_cognitive_account.qnamaker.id}"
#   }
# }

# resource "null_resource" "knowledge_base" {
#   provisioner "local-exec" {
#     interpreter = ["pwsh", "-Command"]
#     command     = <<EOT
#       $tryCount = 10
#       Do{
#         $failed = $false;

#         Try{
#           $data = '${file(var.knowledge_base_source_file)}'
#           $data = [System.Text.Encoding]::UTF8.GetBytes($data)
#           $createResultJson = Invoke-WebRequest -Uri '${azurerm_cognitive_account.qnamaker.endpoint}qnamaker/v4.0/knowledgebases/create'  -Body $data -Headers @{'Content-Type'='application/json'; 'charset'='utf-8';'Ocp-Apim-Subscription-Key'= '${azurerm_cognitive_account.qnamaker.primary_access_key}'} -Method Post

#           $createResult = $createResultJson | ConvertFrom-Json
#           $oppid = $createResult.operationId
#           Write-Host $createResult
#           Write-Host "OperationID: $oppid"

#           $endpoint = '${azurerm_cognitive_account.qnamaker.endpoint}qnamaker/v4.0/operations/'
#           $endpoint = $endpoint + $oppid

#           Do{
#              $resultJson = Invoke-WebRequest -Uri $endpoint -Headers @{'Content-Type'='application/json'; 'charset'='utf-8';'Ocp-Apim-Subscription-Key'= '${azurerm_cognitive_account.qnamaker.primary_access_key}'} -Method Get
#              Write-Host $resultJson
#              $oppResult = $resultJson | ConvertFrom-Json

#              Start-Sleep -s 300
#           } While ($oppResult.resourceLocation -eq $null -And $oppResult.operationState -ne "Failed" )

#           $resourceLocation =  $oppResult.resourceLocation
#           Write-Host "Knowledgebase created: $resourceLocation"
#           $oppResult.resourceLocation | Out-File -Encoding "UTF8" -FilePath "./${local.filepath}"
#         }
#         catch {
#           $failed = $true

#           Write-Host $_
#           Write-Host "Service endpoint may not be ready; $tryCount of 10 tries remaining."

#           $trycount--
#           Start-Sleep -s 300
#         }
#       } While ($failed -eq $true -And $tryCount -gt 0)

#       If($trycount -eq 0)
#       {
#         Write-Host "Error: KB could not be created.  Try again later."
#       }
#     EOT
#   }
#   provisioner "local-exec" {
#     when        = destroy
#     command     = "Remove-Item ./${path.module}/tmp/*.* -Force"
#     interpreter = ["pwsh", "-Command"]
#   }
#   triggers = {
#     "before" = "${azurerm_cognitive_account.qnamaker.id}"
#   }
# }

# resource "null_resource" "knowledge_base_result_if_missing" {
#   depends_on = [null_resource.knowledge_base]
#   triggers = {
#     result = fileexists(local.filepath) ? replace(chomp(file(local.filepath)), "\ufeff", "") : ""
#   }
#   lifecycle {
#     ignore_changes = [
#       triggers
#     ]
#   }
# }

# resource "null_resource" "knowledge_base_result" {
#   depends_on = [null_resource.knowledge_base_result_if_missing]
#   triggers = {
#     id     = null_resource.knowledge_base.id
#     result = fileexists(local.filepath) ? replace(chomp(file(local.filepath)), "\ufeff", "") : lookup(null_resource.knowledge_base_result_if_missing.triggers, "result", "")
#   }
# }

# resource "null_resource" "knowledge_base_publish" {
#   provisioner "local-exec" {
#     command     = <<EOT
#       Write-Host "Publishing knowledgebase"
#       If("${null_resource.knowledge_base_result.triggers["result"]}" -ne "")
#       {
#          $publishResult = Invoke-WebRequest -Uri "${azurerm_cognitive_account.qnamaker.endpoint}qnamaker/v4.0/${null_resource.knowledge_base_result.triggers["result"]}" -Headers @{'Content-Type'='application/json'; 'charset'='utf-8';'Ocp-Apim-Subscription-Key'= '${azurerm_cognitive_account.qnamaker.primary_access_key}'} -Method Post
#       }
#     EOT
#     interpreter = ["pwsh", "-Command"]
#   }
#   depends_on = [null_resource.knowledge_base_result, null_resource.knowledge_base]
# }

# resource "null_resource" "knowledge_base_get_sub_key" {
#   provisioner "local-exec" {
#     command = <<EOT
#       $endpoint = '${azurerm_cognitive_account.qnamaker.endpoint}qnamaker/v4.0/endpointkeys/'
#       $resultJson = Invoke-WebRequest -Uri $endpoint -Headers @{'Content-Type'='application/json'; 'charset'='utf-8';'Ocp-Apim-Subscription-Key'= '${azurerm_cognitive_account.qnamaker.primary_access_key}'} -Method Get
#       Write-Host $resultJson
#       $result = $resultJson | ConvertFrom-Json

#       $resourceLocation =  $oppResult.resourceLocation
#       $result.primaryEndpointKey | Out-File -Encoding "UTF8" -FilePath "./${local.filepath_key}"
#     EOT
#     interpreter = ["pwsh", "-Command"]
#   }
#   depends_on = [
#     null_resource.knowledge_base_publish
#   ]
#   provisioner "local-exec" {
#     when        = destroy
#     command     = "Remove-Item ./${path.module}/tmp/*-key.* -Force"
#     interpreter = ["pwsh", "-Command"]
#   }
#   triggers = {
#     "before" = "${azurerm_cognitive_account.qnamaker.id}"
#   }
# }

# resource "null_resource" "knowledge_base_get_sub_key_result_if_missing" {
#   depends_on = [null_resource.knowledge_base_get_sub_key]
#   triggers = {
#     result = fileexists(local.filepath_key) ? replace(chomp(file(local.filepath_key)), "\ufeff", "") : ""
#   }
#   lifecycle {
#     ignore_changes = [
#       triggers
#     ]
#   }
# }

# resource "null_resource" "knowledge_base_get_sub_key_result" {
#   depends_on = [null_resource.knowledge_base_get_sub_key_result_if_missing]
#   triggers = {
#     id     = null_resource.knowledge_base.id
#     result = fileexists(local.filepath_key) ? replace(chomp(file(local.filepath_key)), "\ufeff", "") : lookup(null_resource.knowledge_base_get_sub_key_result_if_missing.triggers, "result", "")
#   }
# }

output "app_service_endpoint" {
  value = azurerm_app_service.app_service.default_site_hostname
}

output "qnamaker_endpoint" {
  value = azurerm_cognitive_account.qnamaker.endpoint
}

output "qnamaker_name" {
  value = azurerm_cognitive_account.qnamaker.name
}

output "qnamaker_access_key" {
  value = azurerm_cognitive_account.qnamaker.primary_access_key
}

# output "knowledge_base_id" {
#   value = "${null_resource.knowledge_base_result.triggers["result"]}"
# }

# output "knowledge_base_primary_key" {
#   value = "${null_resource.knowledge_base_get_sub_key_result.triggers["result"]}"
# }

# Azure chatbot Terraform

This Terraform configuration will spin up an Azure Knowledge Base with all questions on the CV-FAQ, and a chatbot web app.

The code is based on these modules from canada.ca:

https://github.com/canada-ca-terraform-modules/terraform-azurerm-qna-knowledgebase
https://github.com/canada-ca-terraform-modules/terraform-azurerm-chatbot-app

## Dependencies

- Terraform `0.13.0`
- Powershell
    - `brew cask install powershell` on MacOS

## Instructions

Authenticate via the Azure CLI before applying.

```bash
cd workspaces/sandbox  # or other target environment
terraform apply
```

The creation of the Knowledge Base may take 45+ minutes the first time.

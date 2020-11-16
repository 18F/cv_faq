# Azure chatbot Terraform

This Terraform configuration will spin up an Azure Knowledge Base with all questions on the CV-FAQ, and a chatbot web app.

The code is based on these modules from canada.ca:

https://github.com/canada-ca-terraform-modules/terraform-azurerm-qna-knowledgebase
https://github.com/canada-ca-terraform-modules/terraform-azurerm-chatbot-app

## Dependencies

- Terraform `0.13.0`

## Instructions

Authenticate via the Azure CLI before applying.

```bash
cd workspaces/sandbox  # or other target environment
terraform apply
```

The creation of the Knowledge Base may take 45+ minutes the first time.

## TODO NOTES

The portion of the orchestration that creates the Knowledge Base is implemented via a Python script, `bin/publish_knowledge_base.py`. Due to an Azure bug, automating the creation of the knowledge base does not currently work. As a result, this part of the orchestration is commented out, and one must manually create the associated Knowledge Base via the Azure web console.

This is related to this bug: https://github.com/MicrosoftDocs/azure-docs/issues/44719

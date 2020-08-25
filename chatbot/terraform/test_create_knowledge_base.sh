#!/usr/bin/env bash

# app_service_endpoint = cv-faq-sandbox-chatbot-en-app-service.azurewebsites.net
# qnamaker_access_key = 903f5b0b7b8f492ba30ccabb904dbaf7
# qnamaker_endpoint = https://westus.api.cognitive.microsoft.com/

# python3 ./bin/publish_knowledge_base.py \
#     --source-file /Users/dan/src/cv_faq/chatbot/terraform/sample-data/knowledge-base-sample.json \
#     --endpoint https://westus.api.cognitive.microsoft.com/ \
#     --access-key 2eb9b528c35345fdaa3ace376130371e

# python3 ./bin/publish_knowledge_base.py \
#     --app-service-name cvfaq-qnamaker-appservice-manual \
#     --source-file /Users/dan/src/cv_faq/_site/knowledge-base.json \
#     --endpoint https://westus.api.cognitive.microsoft.com/ \
#     --access-key d1d51cd5a298421f9d8ce46f28659815

# python3 ./bin/publish_knowledge_base.py \
#     --app-service-name cv-faq-sandbox-chatbot-en-app-service \
#     --source-file /Users/dan/src/cv_faq/_site/knowledge-base.json \
#     --endpoint https://westus.api.cognitive.microsoft.com/ \
#     --access-key a0467b9745764e49981f640dacec419a


# cv-faq-sandbox-chatbot-en-cognitive-account-qnamaker-MANUAL
python3 ./bin/publish_knowledge_base.py \
    --cognitive-account cv-faq-sandbox-chatbot-en-cognitive-account-qnamaker-manual \
    --source-file /Users/dan/src/cv_faq/_site/knowledge-base.json \
    --access-key 402f7b16f24e45e0b5389437cd4a00bc

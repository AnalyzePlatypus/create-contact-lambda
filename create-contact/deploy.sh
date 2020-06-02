export $(egrep -v '^#' .env | xargs)
echo $LAMBDA_FUNCTION_NAME
cd create-contact
rm function.zip 
zip -r function.zip app.js node_modules package.json
echo "🌀 Uploading..."
aws lambda update-function-code \
  --function-name=$LAMBDA_FUNCTION_NAME \
  --zip-file=fileb://function.zip \
  --profile=$AWS_UPLOAD_CODE_PROFILE && \
terminal-notifier -title $LAMBDA_FUNCTION_NAME -message '✅ Deploy Complete' -open "https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/${LAMBDA_FUNCTION_NAME}" -appIcon $NOTIFICATION_ICON_PATH && \
curl -X POST -H 'Content-type: application/json' --data '{"text":"🚀 Lambda redeployed"}' $SLACK_DEV_NOTIFICATIONS_WEBHOOK_URL
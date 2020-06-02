rm function.zip 
zip -r function.zip app.js node_modules package.json
echo "🌀 Uploading..."
aws lambda update-function-code \
  --function-name=GrowthShakeCollectLeads \
  --zip-file=fileb://function.zip \
  --profile=GrowthShakeCollectLeadsLambdaUser && \
terminal-notifier -title 'GrowthShake Lambda' -message '✅ Deploy Complete' -open 'https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/asset-search-index-regenerator' -appIcon '/Users/developer/workspace/loanmower-frontend/S3 Logo.png' && \
curl -X POST -H 'Content-type: application/json' --data '{"text":"🚀 GrowthShake Lambda redeployed"}' https://hooks.slack.com/services/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
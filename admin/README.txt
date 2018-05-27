export PROJECT_ID=<my project id>
firebase list
firebase use $PROJECT_ID
mkdir admin/keys
cp ~/Download/$PROJECT_ID-firebase-adminsdk-xxxxxxxxxxxx.json admin/keys/$PROJECT_ID-firebase.json
mkdir admin/data
node admin/export-firestore.js > admin/data/$PROJECT_ID-firestore.json
node admin/clear-firestore.js
node admin/import-firestore.js < admin/data/$PROJECT_ID-firestore.json
firebase auth:export admin/data/$PROJECT_ID-accounts.json
firebase auth:import admin/data/$PROJECT_ID-accounts.json

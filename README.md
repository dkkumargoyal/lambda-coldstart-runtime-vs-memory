# lambda-coldstart-runtime-vs-memory


1. install nodejs - follow instruction based on your os from following URL

https://nodejs.org/en/download/package-manager/

2. install serverless framework

sudo npm install serverless -g

3. git clone https://github.com/dkkumargoyal/lambda-coldstart-runtime-vs-memory.git

4. cd lambda-coldstart-runtime-vs-memory

5. npm install

6. bash build.sh

7. node download-stats.js > result.csv

8. node analyse.js > aggregate.csv

now you can study the data in result.csv and aggregate.csv and gain insights.

const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = process.env.PROJECT_ID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
async function checkDeployments() {
  try {
    const res = await axios.get(
      `https://api.vercel.com/v13/deployments?projectId=${PROJECT_ID}&limit=3`,
      { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
    );
    for (let deploy of res.data.deployments) {
      if (deploy.state === 'ERROR') {
        const logRes = await axios.get(
          `https://api.vercel.com/v13/deployments/${deploy.uid}/logs?type=build`,
          { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
        );
        const errorLog = logRes.data.logs.map(log => log.text).join('\n').slice(-4000);
        const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));
        const gptRes = await openai.createChatCompletion({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "Sei un devops. Analizza errori di build Vercel." },
            { role: "user", content: `Ecco il log di errore:\n${errorLog}\nSpiega l'errore e suggerisci una correzione.` }
          ]
        });
        console.log('------');
        console.log('Errore Build Vercel:', deploy.meta.githubCommitMessage || deploy.url);
        console.log('Analisi AI:', gptRes.data.choices[0].message.content);
      }
    }
  } catch (err) {
    console.error('Errore:', err.message);
  }
}
setInterval(checkDeployments, 5 * 60 * 1000);
checkDeployments();

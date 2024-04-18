const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submitData', async (req, res) => {
    const {
        studentSurveyID,
        studentID,
        result,
        lastEmailSentOn,
        totalNumberOfRemindersSent,
        responseReceivedOn,
        firstEmailDate,
        resultEmailSentOn,
        questionIDs,
        answers
    } = req.body;

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: 'ADMIN',
            password: 'SystemDev2024',
            connectString: '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=g551223fab81679_systemdevelopmentproject_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))'
        });

        // Insert data into StudentSurvey table
        await connection.execute(
            `INSERT INTO StudentSurvey (StudentSurveyID, StudentID, Result, LastEmailSentOn, TotalNumberOfRemindersSent, ResponseReceivedOn, FirstEmailDate, ResultEmailSentOn)
            VALUES (:studentSurveyID, :studentID, :result, :lastEmailSentOn, :totalNumberOfRemindersSent, :responseReceivedOn, :firstEmailDate, :resultEmailSentOn)`,
            {
                studentSurveyID,
                studentID,
                result,
                lastEmailSentOn,
                totalNumberOfRemindersSent,
                responseReceivedOn,
                firstEmailDate,
                resultEmailSentOn
            },
            { autoCommit: true }
        );

        // Insert data into SurveyResponses table
        for (let i = 0; i < questionIDs.length; i++) {
            await connection.execute(
                `INSERT INTO SurveyResponses (StudentSurveyID, QuestionID, Response)
                VALUES (:studentSurveyID, :questionID, :response)`,
                {
                    studentSurveyID,
                    questionID: questionIDs[i],
                    response: answers[i]
                },
                { autoCommit: true }
            );
        }

        res.send('Survey Response Submitted Successfully.');
    } catch (error) {
        console.error('Error Submitting Survey Response:', error);
        res.status(500).send('An error occurred while processing the survey response.');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error('Error Closing Connection:', error);
            }
        }
    }
});

app.use(express.static('SystemDevelopmentProject'));

app.get('/', (req, res) => {
    res.redirect('sign-in.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
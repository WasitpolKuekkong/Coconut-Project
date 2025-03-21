import mysql from 'mysql2/promise';
import { dbConfig } from '../config/poom_db_config';

export default defineEventHandler(async () => {
  let connection;

  try {

    connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute('SELECT * FROM employee WHERE status = 1 ');

   

    if (rows.length === 0) {
      return { message: 'No members available.' };
    }


      const employeen = rows.map((employee) => {
        let imageBase64 = null;
        if (employee.image) {

          const imageBuffer = Buffer.from(employee.image);
          let mimeType = 'image/jpeg'; 
  
          if (
            imageBuffer[0] === 0x89 &&
            imageBuffer[1] === 0x50 &&
            imageBuffer[2] === 0x4E &&
            imageBuffer[3] === 0x47
          ) {
            mimeType = 'image/png'; 
          }
  
          imageBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
        }
        
      return {
        ...employee,
        image: imageBase64,
      };
    });


    return employeen;
  } catch (error) {
    console.error('Error fetching members:', error);
    return {
      statusCode: 500,
      body: { error: 'Failed to fetch members' },
    };
  } finally {

    if (connection) {
      await connection.end();
    }
  }
});

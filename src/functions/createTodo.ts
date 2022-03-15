import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuid } from 'uuid';
import { document } from "../utils/dynamodbClient";
import dayjs from 'dayjs';

interface IRequest {
  title: string;
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { title, deadline } = JSON.parse(event.body) as IRequest;
  const { user_id  } = event.pathParameters;

  const id = uuid();

  await document.put({
    TableName: 'todos',
    Item: {
      id,
      user_id,
      title,
      done: false,
      deadline: dayjs(deadline).format('DD/MM/YYYY'),
      created_at: dayjs().format('DD/MM/YYYY')
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Todo has been created!'
    })
  }
}
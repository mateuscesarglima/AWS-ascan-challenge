const AWS = require("aws-sdk");
const uuid = require("uuid");
const dynamo = new AWS.DynamoDB.DocumentClient();
let response;

exports.FetchAllUsers = async (event, context) => {
  const data = await dynamo
    .scan({
      TableName: "usersDB",
    })
    .promise();
  response = {
    statusCode: 200,
    body: JSON.stringify({ users: data.Items }),
  };
  return response;
};

exports.CreateUser = async (event, context) => {
  const { username, email, password } = JSON.parse(event.body);
  await dynamo
    .put({
      TableName: "usersDB",
      Item: {
        id: uuid.v4(),
        username,
        email,
        password,
      },
    })
    .promise();
  response = {
    statusCode: 200,
    body: JSON.stringify({ message: "User Created successfully" }),
  };
  return response;
};

exports.DeleteUser = async (event, context) => {
  await dynamo
    .delete({
      TableName: "usersDB",
      Key: {
        id: event.pathParameters.id,
      },
    })
    .promise();
  response = {
    statusCode: 200,
    body: JSON.stringify({ message: "User deleted successfully" }),
  };
  return response;
};

exports.UpdateUser = async (event, context) => {
  const Item = JSON.parse(event.body);
  await dynamo
    .update({
      TableName: "usersDB",
      Key: {
        id: event.pathParameters.id,
      },
      UpdateExpression: "set username= :u, email= :e, password= :p",
      ExpressionAttributeValues: {
        ":u": Item.username,
        ":e": Item.email,
        ":p": Item.password,
      },
      Returnvalues: "UPDATED_NEW",
    })
    .promise();
  response = {
    statusCode: 200,
    body: JSON.stringify({ message: "User updated successfully " }),
  };
  return response;
};

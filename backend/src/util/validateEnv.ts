import * as envalid from 'envalid';

const { str, port } = envalid;

export default envalid.cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
});
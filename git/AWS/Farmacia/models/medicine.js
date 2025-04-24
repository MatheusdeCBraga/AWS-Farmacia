const sequelize = require('sequelize');

const DB_DATABASE = process.env.DB_DATABASE || "aws_db";
const DB_USERNAME = process.env.DB_USERNAME || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "1q2w3e4r";
const DB_HOST = process.env.DB_HOST || "aws_psql";

const seque = new sequelize.Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
});

class Medicine extends sequelize.Model {
    async saveMedicine() {
        try {
            await this.save();
            console.log(`Medicamento ${this.name} salvo com sucesso!`);
        } catch (error) {
            console.error('Erro ao salvar o medicamento:', error);
            throw error;
        }
    }
}

Medicine.init({
    name: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    quantity: {
        type: sequelize.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        }
    }
}, {
    sequelize: seque,
    modelName: 'Medicine'
});

exports.initDatabase = async () => {
    try {
        await seque.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        await seque.sync({ alter: true });
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
};

exports.Medicine = Medicine;
import { Sequelize, CreationOptional, InferAttributes, InferCreationAttributes, DataTypes } from "sequelize"
import { Model } from "sequelize-typescript"

export interface Video extends Model<InferAttributes<Video>, InferCreationAttributes<Video>> {
    transcript: CreationOptional<string>,
    completed: boolean,
    upload_url: string,
    last_chunk: number,
    poster: CreationOptional<string>,
    file_size: number
}

export default function (sequelize: Sequelize) {
    return sequelize.define<Video>("video", {
        upload_url: {
            defaultValue: DataTypes.UUIDV4,
            type: DataTypes.UUID,
            allowNull: false
        },
        transcript: {
            type: DataTypes.TEXT('long'),
        },
        completed: {
            defaultValue: false,
            type: DataTypes.BOOLEAN
        },
        last_chunk: {
            defaultValue: 0,
            type: DataTypes.INTEGER
        },
        file_size: {
            defaultValue: 0,
            type: DataTypes.INTEGER
        },
        poster: {
            type: DataTypes.BLOB("medium")
        },
    })
}

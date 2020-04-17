import {
    Model,
    ModelAttributes,
    DataTypes,
    Sequelize,
    Association,

    // One to many association mixins
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyAddAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyCreateAssociationMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    HasManyCountAssociationsMixin,

    // One to one associations mixins
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    HasOneCreateAssociationMixin,

    // Descendant-Parent relations (belongsTo)
    // are defined on the parent table as a one to one
    // or one to many relation

    IndexesOptions,
} from 'sequelize';

const _<%= classify(name) %>Def: ModelAttributes = {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Primary key for this record'
    },
    name: DataTypes.STRING(150),
    displayName: {
        type: DataTypes.STRING(300),
        field: 'display_name',
        comment: 'Name to be displayed on GUI screens'
    },
    // Include other fields here
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
        field: 'created_at',
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
        field: 'updated_at',
    },
    deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at',
    },
};
const indexes: IndexesOptions[] = [
    {
        unique: true,
        fields: ['name'],
    },
];

export class <%= classify(name) %> extends Model {
    public static associations: {
        // One to many
        manyTables: Association <<%= classify(name) %>, ManyTable>;

        // One to one
        oneTable: Association <<%= classify(name) %>, OneTable>;

        // Many to many (?)
        // usually not considered
    };

    // Associations
    // Refer to above associations type
    // -- One to many
    public readonly manyTables?: ManyTable[];
    public getManyTables       : HasManyGetAssociationsMixin   <ManyTable>;
    public setManyTables       : HasManySetAssociationsMixin   <ManyTable>;
    public addManyTables       : HasManyAddAssociationsMixin   <ManyTable>;
    public addManyTable        : HasManyAddAssociationMixin    <ManyTable>;
    public createManyTable     : HasManyCreateAssociationMixin <ManyTable>;
    public removeManyTable     : HasManyRemoveAssociationMixin <ManyTable>;
    public removeManyTables    : HasManyRemoveAssociationsMixin<ManyTable>;
    public hasManyTable        : HasManyHasAssociationMixin    <ManyTable>;
    public hasManyTables       : HasManyHasAssociationsMixin   <ManyTable>;
    public countManyTables     : HasManyCountAssociationsMixin ;

    // -- One to one
    public readonly oneTable?: OneTable;
    public getOneTable   : HasOneGetAssociationMixin   <OneTable>;
    public setOneTable   : HasOneSetAssociationMixin   <OneTable>;
    public createOneTable: HasOneCreateAssociationMixin<OneTable>;

    // Table fields
    public id: number;
    public name ? : string | null;
    public displayName ? : string | null;
    // Other fields

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt ? : Date | null;

    static associate() {
        // One to many relations
        // (<%= classify(name) %> has one or many ManyTable
        // ManyTable belongsTo <%= classify(name) %>)
        <%= classify(name) %>.hasMany(ManyTable, { // CHANGE ME!
          foreignKey: '<%= underscore(name) %>_id',
          as: 'ManyTable_alias', // CHANGE ME!
        });
        ManyTableObject.belongsTo(<%= classify(name) %>, { // CHANGE ME!
          foreignKey: '<%= underscore(name) %>_id',
          as: '<%= classify(name) %>_alias' // CHANGE ME!
        });

        // One to one relations
        // (<%= classify(name) %> has only one OneOneTable
        // OneOneTable belongsTo <%= classify(name) %>)
        <%= classify(name) %>.hasOne(OneOneTable); // CHANGE ME!
        OneOneTable.belongsTo(<%= classify(name) %>); // CHANGE ME!

        // Many to many relations (using "through table")
        // (<%= classify(name) %> has one or many through_table_name
        // ManyManyTable also has one or many through_table_name
        // therefore a many to many relation between both tables)
        <%= classify(name) %>.belongsToMany(ManyManyTable, { // CHANGE ME!
            through: 'through_table_name', // CHANGE ME!
            as: '<%= classify(name) %>_alias', // CHANGE ME!
            foreignKey: '<%= underscore(name) %>_id',
            otherKey: 'ManyManyTable_id', // CHANGE ME!
          });
          ManyManyTable.belongsToMany(<%= classify(name) %>, {
            through: 'through_table_name', // CHANGE ME!
            as: 'ManyManyTable_alias', // CHANGE ME!
            foreignKey: 'ManyManyTable_id', // CHANGE ME!
            otherKey: '<%= underscore(name) %>_id',
          });

      }

    static initialize(sequelize: Sequelize, _DataTypes: any) {
        <%= classify(name) %>.init(_<%= classify(name) %>Def, {
            sequelize,
            schema: '<%= schema %>',
            modelName: '<%= camelize(name) %>',
            tableName: '<%= underscore(name) %>',
            freezeTableName: true,
            paranoid: true,
            timestamps: true,
            underscored: true,
            indexes,
        });
        return this;
    }

}
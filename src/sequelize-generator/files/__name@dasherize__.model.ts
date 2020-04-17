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
    type         : DataTypes.BIGINT,
    allowNull    : false,
    primaryKey   : true,
    autoIncrement: true,
    comment      : 'Llave primaria'
  },
  name: {
    type   : DataTypes.STRING(150),
    comment: 'Nombre para identificar el registro.'
  },
  displayName: {
    type   : DataTypes.STRING(300),
    field  : 'display_name',
    comment: 'Nombre a ser desplegado en las pantallas'
  },
  // Include other fields here
  createdAt: {
    type        : DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull   : false,
    field       : 'created_at',
    comment     : 'Fecha de creacion del registro'
  },
  updatedAt: {
    type        : DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull   : false,
    field       : 'updated_at',
    comment     : 'Fecha de actualizacion del registro. Al momento de crearse el registro toma el mismo valor que createdAt.'
  },
  deletedAt: {
    type   : DataTypes.DATE,
    field  : 'deleted_at',
    comment: 'Fecha en que el registro es marcado como borrado. Es un borrado lógico por lo que el registro no es eliminado de la tabla.'
  },
};
const indexes: IndexesOptions[] = [
  {
    unique: true,
    fields: ['name'],
  },
];

/**
 * La tabla <%= underscore(name) %> tiene por objetivo el almacenamiento de 
 * registros --incluya una descripcion util en esta seccion, incluyndo lógica de negocios--
 */
export class <%= classify(name) %> extends Model {
  public static associations: {
    // One to many
    manyTables: Association<<%= classify(name) %>, ManyTable>;

    // One to one
    oneTable: Association<<%= classify(name) %>, OneTable>;

    // Many to many (?)
    // usually not considered
  };

  // Associations
  // Refer to above associations type
  // -- One to many
  public readonly manyTables ?: ManyTable[];
  public getManyTables        : HasManyGetAssociationsMixin    <ManyTable>;
  public setManyTables        : HasManySetAssociationsMixin    <ManyTable, number>;
  public addManyTables        : HasManyAddAssociationsMixin    <ManyTable, number>;
  public addManyTable         : HasManyAddAssociationMixin     <ManyTable, number>;
  public createManyTable      : HasManyCreateAssociationMixin  <ManyTable>;
  public removeManyTable      : HasManyRemoveAssociationMixin  <ManyTable, number>;
  public removeManyTables     : HasManyRemoveAssociationsMixin <ManyTable, number>;
  public hasManyTable         : HasManyHasAssociationMixin     <ManyTable, number>;
  public hasManyTables        : HasManyHasAssociationsMixin    <ManyTable, number>;
  public countManyTables      : HasManyCountAssociationsMixin;

  // -- One to one
  public readonly oneTable ?: OneTable;
  public getOneTable        : HasOneGetAssociationMixin    <OneTable>;
  public setOneTable        : HasOneSetAssociationMixin    <OneTable, number>;
  public createOneTable     : HasOneCreateAssociationMixin <OneTable>;

  // Table fields
  public id           : number;
  public name        ?: string | null;
  public displayName ?: string | null;
  // Other fields

  public readonly createdAt! : Date;
  public readonly updatedAt! : Date;
  public readonly deletedAt ?: Date | null;

  static associate() {
    // One to many relations
    // (<%= classify(name) %> has one or many ManyTable
    // ManyTable belongsTo <%= classify(name) %>)
    <%= classify(name) %>.hasMany(ManyTable, { // CHANGE ME!
      foreignKey: '<%= underscore(name) %>_id',
      as        : 'ManyTable_alias',              // CHANGE ME!
    });
    ManyTableObject.belongsTo(<%= classify(name) %>, { // CHANGE ME!
      foreignKey: '<%= underscore(name) %>_id',
      as        : '<%= classify(name) %>_alias'  // CHANGE ME!
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
      through   : 'through_table_name',            // CHANGE ME!
      as        : '<%= classify(name) %>_alias',   // CHANGE ME!
      foreignKey: '<%= underscore(name) %>_id',
      otherKey  : 'ManyManyTable_id',              // CHANGE ME!
    });
    ManyManyTable.belongsToMany(<%= classify(name) %>, {
      through   : 'through_table_name',           // CHANGE ME!
      as        : 'ManyManyTable_alias',          // CHANGE ME!
      foreignKey: 'ManyManyTable_id',             // CHANGE ME!
      otherKey  : '<%= underscore(name) %>_id',
    });

  }

  static initialize(sequelize: Sequelize, _DataTypes: any) {
    <%= classify(name) %>.init(_<%= classify(name) %>Def, {
      sequelize,
      schema         : '<%= schema %>',
      modelName      : '<%= camelize(name) %>',
      tableName      : '<%= underscore(name) %>',
      freezeTableName: true,
      paranoid       : true,
      timestamps     : true,
      underscored    : true,
      indexes,
    });
    return this;
  }

}
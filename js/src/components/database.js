import React from 'react';

const Database = ({ database, active, handleClick }) => {
  const { name, server, data_source } = database;
  const mainClass = `database__container${active ? ' database__active' : ''}`;
  const setActiveDatabase = () => handleClick(database);
  return (
    <div
      className={mainClass}
      role="button"
      onClick={setActiveDatabase}
    >
      <div className="database__name">{name}</div>
      <div className="database__server">
        <span className="database__server-label">Server:</span>
        <span className="database__server-value">{server}</span>
      </div>
      <div className="database__data_source">
        <span className="database__data_source-label">Data Source:</span>
        <span className="database__data_source-value">{data_source}</span>
      </div>
    </div>
  );
};

export default Database;


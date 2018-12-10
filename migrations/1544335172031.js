module.exports = (client) => {
  return client
    .query(`
      CREATE TABLE events (
        id SERIAL,
        stream_id UUID NOT NULL,
        stream_version INT NOT NULL,
        event_name varchar(60) NOT NULL,
        event_data jsonb,
        meta_data jsonb,
        stored_at timestamp DEFAULT current_timestamp
      )
    `);
}

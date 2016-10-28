package com.github.syuchan1005.sqlbridgeserver.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Created by syuchan on 2016/07/03.
 */
public class MySQL implements Database {
	private final String hostIP;
	private final int port;
	private final String dbName;
	private final String user;
	private final String pass;
	public Connection connection;

	public MySQL(String hostIP, int port, String dbName, String user, String pass) throws SQLException {
		this.hostIP = hostIP;
		this.port = port;
		this.dbName = dbName;
		this.user = user;
		this.pass = pass;
		connection = DriverManager.getConnection("jdbc:mysql://" + hostIP + ":" + port + "/" + dbName, user, pass);
	}

	public void createTable(String tableName) throws SQLException {
		connection.createStatement()
				.executeUpdate("CREATE TABLE IF NOT EXISTS " + tableName +
						"(ID INT AUTO_INCREMENT, Time TIMESTAMP, Units INT NOT NULL, Age TEXT, Taste TEXT, PRIMARY KEY(ID));");
	}

	@Override
	public int sumUnits(String tableName) throws SQLException {
		createTable(tableName);
		ResultSet resultSet = connection.createStatement().executeQuery("SELECT SUM(Units) FROM " + tableName);
		resultSet.next();
		return resultSet.getInt(1);
	}

	@Override
	public int addUnits(String tableName, String Units, String Age, String Taste) throws SQLException {
		createTable(tableName);
		String sql = "INSERT INTO " + tableName + "(Units";
		String value = Units;
		if (Age != null) {
			sql += ", Age";
			value += ", \"" + Age + "\"";
		}
		if (Taste != null) {
			sql += ", Taste";
			value += ", \"" + Taste + "\"";
		}
		sql += ") VALUES (" + value + ");";
		Statement statement = connection.createStatement();
		statement.executeUpdate(sql, Statement.RETURN_GENERATED_KEYS);
		ResultSet resultSet = statement.getGeneratedKeys();
		resultSet.next();
		return resultSet.getInt(1);
	}

	@Override
	public void deleteUnit(String tableName, int id) throws SQLException {
		connection.createStatement().executeUpdate("DELETE FROM " + tableName + " WHERE ID = " + id + ";");
	}

	@Override
	public void timeoutCheck() throws SQLException {
		try {
			connection.createStatement().executeUpdate("SHOW TABLES;");
		} catch (SQLException e) {
			try {
				connection = DriverManager.getConnection("jdbc:mysql://" + hostIP + ":" + port + "/" + dbName, user, pass);
			} catch (SQLException e1) {
				throw e;
			}
		}
	}
}

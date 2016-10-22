package com.github.syuchan1005.sqlbridgeserver.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Created by syuchan on 2016/07/03.
 */
public class MySQL implements Database {
	public Connection connection;
	public static PreparedStatement SumUnitsState;

	public MySQL(String hostIP, int port, String DBName, String user, String pass) throws SQLException {
		connection = DriverManager.getConnection("jdbc:mysql://"
				+ hostIP + ":" + port + "/" + DBName, user, pass);
	}

	public void createTable(String tableName) throws SQLException {
		connection.createStatement()
				.executeUpdate("CREATE TABLE IF NOT EXISTS " + tableName +
						"(ID INT AUTO_INCREMENT, Time TIMESTAMP, Units INT NOT NULL, Age INT, Taste TEXT, PRIMARY KEY(ID));");
	}

	@Override
	public int sumUnits(String tableName) throws SQLException {
		createTable(tableName);
		ResultSet resultSet = connection.createStatement().executeQuery("SELECT SUM(Units) FROM " + tableName);
		resultSet.next();
		return resultSet.getInt(1);
	}

	@Override
	public void addUnits(String tableName, String Units, String Age, String Taste) throws SQLException {
		createTable(tableName);
		String sql = "INSERT INTO " + tableName + "(Units", value = Units;
		if(Age != null) {
			sql += ", Age";
			value += ", \"" + Age + "\"";
		}
		if(Taste != null) {
			sql += ", Taste";
			value += ", \"" + Taste + "\"";
		}
		sql += ") VALUES (" + value + ");";
		connection.createStatement().executeUpdate(sql);
	}

	public static PreparedStatement DeleteUnits;
	@Deprecated
	public void deleteUnits(String tableName, int ID) throws SQLException {
		if(DeleteUnits == null) {
			DeleteUnits = connection.prepareStatement("DELETE FROM ? WHERE ID = ?");
		}
		DeleteUnits.setString(1, tableName);
		DeleteUnits.setInt(2, ID);
		DeleteUnits.executeUpdate();
		DeleteUnits.clearParameters();
	}

	@Deprecated
	public int getLastId(String tableName) throws SQLException {
		createTable(tableName);
		ResultSet resultSet = connection.createStatement().executeQuery("SELECT ID FROM " + tableName + " ORDER BY ID DESC LIMIT 1;");
		resultSet.next();
		return resultSet.getInt(1);
	}

	@Override
	public void deleteLastUnit(String tableName) throws SQLException {
		connection.createStatement().executeUpdate("DELETE FROM " + tableName + " ORDER BY ID DESC LIMIT 1;");
	}
}

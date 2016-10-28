package com.github.syuchan1005.sqlbridgeserver.database;

import java.sql.SQLException;

/**
 * Created by syuchan on 2016/09/09.
 */
public interface Database {
	void createTable(String tableName) throws SQLException;

	int sumUnits(String tableName) throws SQLException;

	int addUnits(String tableName, String Units, String Age, String Taste) throws SQLException;

	void deleteUnit(String tableName, int id) throws SQLException;

	void timeoutCheck() throws SQLException;
}

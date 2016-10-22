package com.github.syuchan1005.sqlbridgeserver;

import com.github.syuchan1005.sqlbridgeserver.database.Database;
import com.github.syuchan1005.sqlbridgeserver.database.Test;
import spark.Spark;

/**
 * Created by syuchan on 2016/10/08.
 */
public class Main {

	public static void main(String[] args) {
		/*
		try {
			data = new MySQL("192.168.0.15", 26720, "school", "schoolApp", "salesio");
		} catch (SQLException e) {
			e.printStackTrace();
			// return;
		}
		*/
		Database database = new Test();
		Spark.port(26730);
		SocketServer chatServer = new SocketServer(database);
		APIServer apiServer = new APIServer(database);
	}
}

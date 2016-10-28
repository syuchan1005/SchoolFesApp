package com.github.syuchan1005.sqlbridgeserver;

import com.github.syuchan1005.sqlbridgeserver.database.Database;

import static spark.Spark.init;
import static spark.Spark.staticFileLocation;
import static spark.Spark.webSocket;
import static spark.Spark.webSocketIdleTimeoutMillis;

/**
 * Created by syuchan on 2016/10/09.
 */
public class SocketServer {
	private static Database database;

	public SocketServer(Database database) {
		SocketServer.database = database;
		webSocket("/web", WebSocketHandler.class);
		webSocketIdleTimeoutMillis(300000); // 5min
		init();
	}

	public static Database getDatabase() {
		return database;
	}
}
package com.github.syuchan1005.sqlbridgeserver;

import com.github.syuchan1005.sqlbridgeserver.database.Database;
import com.github.syuchan1005.sqlbridgeserver.database.MySQL;
import com.github.syuchan1005.sqlbridgeserver.database.Test;
import spark.Spark;

import java.sql.SQLException;

/**
 * Created by syuchan on 2016/10/08.
 */
public class Main {

	public static void main(String[] args) {
		Database database = null;
		try {
			database = new MySQL("192.168.0.14", 23306, "school", "school", "DKDe75xVwUBP6QrU");
		} catch (SQLException e) {
			e.printStackTrace();
		}
		if (database == null) {
			System.out.println("!!!!!!!!!!!!!!TESTING!!!!!!!!!!!!!!");
			database = new Test();
		}
		new TimeoutThread(database).start();
		Spark.port(26731);
		SocketServer chatServer = new SocketServer(database);
		APIServer apiServer = new APIServer(database);
	}

	static class TimeoutThread extends Thread {
		private Database database;

		public TimeoutThread(Database database) {
			this.database = database;
		}

		@Override
		public void run() {
			while (true) {
				try {
					database.timeoutCheck();
				} catch (SQLException e) {
					e.printStackTrace();
				}
				try {
					Thread.sleep(300000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
		}
	}
}

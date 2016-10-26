package com.github.syuchan1005.sqlbridgeserver;

import com.github.syuchan1005.sqlbridgeserver.database.Database;
import com.github.syuchan1005.sqlbridgeserver.database.Test;
import spark.Spark;

import java.util.Random;

/**
 * Created by syuchan on 2016/07/06.
 */
public class APIServer {
	public APIServer(Database database) {
		Spark.get("/school/v1/units", (req, res) -> {
			String group = req.queryParams("group");
			System.out.println("   GET: /school/units?group=" + group);
			res.header("Content-Type", "application/json; charset=utf-8");
			String callback = req.queryParams("callback");
			callback = (callback != null) ? callback : "callback";
			try {
				return callback + "({\"Units\": \"" + database.sumUnits(group) + "\"})";
			} catch (Exception e) {
				e.printStackTrace();
				res.status(400);
				return callback + "({\"Units\": \"Err\"})";
			}
		});

		Spark.post("/school/v1/units", (req, res) -> {
			String callback = req.queryParams("callback");
			callback = (callback != null) ? callback : "callback";
			try {
				System.out.println("  POST: /school/units?group=" + req.queryParams("group") +
						"&units=" + req.queryParams("units") +
						"&age=" + req.queryParams("age") +
						"&taste=" + req.queryParams("taste"));
				int id = database.addUnits(req.queryParams("group"),
						req.queryParams("units"),
						req.queryParams("age"),
						req.queryParams("taste"));
				return "{\"ID\": \"" + id + "\"}";
			} catch (Exception e) {
				e.printStackTrace();
				res.status(400);
				return "{\"ID\": \"Err\"}";
			}
		});

		Spark.post("/school/v1/units/del", (req, res) -> {
			try {
				System.out.println("DELETE: /school/units?group=" + req.queryParams("group") + "&id=" + req.queryParams("id"));
				database.deleteUnit(req.queryParams("group"), Integer.parseInt(req.queryParams("id")));
			} catch (Exception e) {
				e.printStackTrace();
				res.status(400);
			}
			return "";
		});
	}
}

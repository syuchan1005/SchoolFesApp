package com.github.syuchan1005.sqlbridgeserver.database;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by syuchan on 2016/09/09.
 */
public class Test implements Database {
	private static Map<String, List<DataSample>> data = new HashMap<>();

	@Override
	public void createTable(String tableName) throws SQLException {
		if (!data.containsKey(tableName)) data.put(tableName, new ArrayList<>());
	}

	@Override
	public int sumUnits(String tableName) throws SQLException {
		createTable(tableName);
		int sum = 0;
		for (DataSample dataSample : data.get(tableName)) {
			sum += Integer.valueOf(dataSample.getUnits());
		}
		return sum;
	}

	@Override
	public void addUnits(String tableName, String Units, String Age, String Taste) throws SQLException {
		createTable(tableName);
		if (data.containsKey(tableName)) {
			data.get(tableName).add(new DataSample(Integer.parseInt(Units), Age, Taste));
		} else {
			throw new SQLException("No table exits");
		}
	}

	@Override
	public void deleteLastUnit(String tableName) throws SQLException {
		createTable(tableName);
		if (data.containsKey(tableName)) {
			List<DataSample> dataSamples = data.get(tableName);
			dataSamples.remove(dataSamples.size() - 1);
		} else {
			throw new SQLException("No table exits");
		}
	}

	public class DataSample {
		private int Units;
		private String Age;
		private String Taste;

		public DataSample(int units, String age, String taste) {
			Units = units;
			Age = age;
			Taste = taste;
		}

		public int getUnits() {
			return Units;
		}

		public void setUnits(int units) {
			Units = units;
		}

		public String getAge() {
			return Age;
		}

		public void setAge(String age) {
			Age = age;
		}

		public String getTaste() {
			return Taste;
		}

		public void setTaste(String taste) {
			Taste = taste;
		}
	}
}

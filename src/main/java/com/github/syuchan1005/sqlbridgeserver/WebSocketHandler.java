package com.github.syuchan1005.sqlbridgeserver;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.syuchan1005.sqlbridgeserver.database.Database;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Created by syuchan on 2016/10/09.
 */
@WebSocket
public class WebSocketHandler {
	private static Set<Session> sessions = Collections.synchronizedSet(new HashSet<>());
	private static ObjectMapper objectMapper = new ObjectMapper();
	private static Database database = SocketServer.getDatabase();

	@OnWebSocketConnect
	public void onConnect(Session session) throws Exception {
		sessions.add(session);
	}

	@OnWebSocketClose
	public void onClose(Session session, int statusCode, String reason) {
		sessions.remove(session);
	}

	@OnWebSocketMessage
	public void onMessage(Session session, String message) throws IOException {
		if (message.equals("Keep-Alive")) return;
		try {
			WebSocketJson webSocketJson = objectMapper.readValue(message, WebSocketJson.class);
			Map<String, String> param = webSocketJson.param;
			switch (webSocketJson.mode) {
				case "GET":
					int unit = database.sumUnits(param.get("group"));
					session.getRemote().sendString("{\"status\": \"OK\", \"units\": \""+ unit +"\"}");
					return;
				case "POST":
					database.addUnits(param.get("group"), param.get("units"), param.get("age"), param.get("taste"));
					session.getRemote().sendString("{\"status\": \"OK\"}");
					return;
				case "DELETE":
					database.deleteLastUnit(param.get("group"));
					session.getRemote().sendString("{\"status\": \"OK\"}");
					return;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		session.getRemote().sendString("{\"status\": \"Error\"}");
	}

}
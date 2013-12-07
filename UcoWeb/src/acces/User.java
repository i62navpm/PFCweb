package acces;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

/**
 * Servlet implementation class User
 */
@WebServlet("/User")
public class User extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private MongoClient mongoClient = null;
    private DB db = null;
    private DBCollection coll = null;
       
    /**
     * @throws UnknownHostException 
     * @see HttpServlet#HttpServlet()
     */
    public User() throws UnknownHostException {
        super();
        // TODO Auto-generated constructor stub
        mongoClient = new MongoClient("localhost", 27017);
        db = mongoClient.getDB("UcoWeb");
        coll = db.getCollection("Users");
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub

		JSONObject obj = new JSONObject();
		
		Pattern email = Pattern.compile(request.getParameter("email").toLowerCase(), Pattern.CASE_INSENSITIVE);
		Pattern password = Pattern.compile(request.getParameter("password").toLowerCase(), Pattern.CASE_INSENSITIVE);
		BasicDBObject query = new BasicDBObject("email", email).
											append("password", password);
		DBObject myDoc = coll.findOne(query);
		
		if (myDoc != null){
			System.out.println("Encontrado el usuario");
			
			Document doc = Jsoup.connect("http://localhost:8080/UcoWeb/web/menu.html").get();
			String container = doc.getElementsByClass("container").html();
			
		
			HttpSession session = request.getSession(true);
			session.setAttribute(session.getId(),myDoc.get("name").toString());
			System.out.println(session.isNew());
	
			try {
				obj.put("user", myDoc.get("name").toString());
				obj.put("body", container.toString());
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else{
			System.out.println("No se ha encontrado el usuario");
			try {
				obj.put("user", false);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		response.setContentType("application/json");
		response.getWriter().write(obj.toString());
		
		
	}

}

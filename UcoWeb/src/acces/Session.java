package acces;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.bson.types.ObjectId;
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
 * Servlet implementation class Session
 */
@WebServlet("/Session")
public class Session extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private MongoClient mongoClient = null;
    private DB db = null;
    private DBCollection coll = null;
    /**
     * @throws UnknownHostException 
     * @see HttpServlet#HttpServlet()
     */
    public Session() throws UnknownHostException {
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
		
		String subject = request.getParameter("subject");
		JSONObject obj = new JSONObject();
		System.out.println(subject);
		HttpSession session = request.getSession(true);
		
		try {
			if (subject.equals("signIn")){
				if (session.isNew() || !isRegistered(session)){
					System.out.println("Nuevo usuario");
					obj.put("user", false);
				}
				else{
					System.out.println(session.getAttribute(session.getId()));
					
					ObjectId id = new ObjectId(session.getAttribute(session.getId()).toString());

					BasicDBObject query = new BasicDBObject("_id", id);
					DBObject myDoc = coll.findOne(query);
					
					Document doc = Jsoup.connect("http://localhost:8080/UcoWeb/web/menu.html").get();
					String container = doc.getElementsByClass("container").html();
				
					obj.put("user", myDoc);
					obj.put("id", myDoc.get("_id").toString());
					obj.put("body", container.toString());
				}
			}
			else if (subject.equals("logOut")){
				session.invalidate();
				obj.put("exit", true);
				 
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		response.setContentType("application/json");
		response.getWriter().write(obj.toString());
	}
	
	protected boolean isRegistered(HttpSession session){
		if(session.getAttribute(session.getId()) != null){
			return true;
		};
		return false;
	}
}

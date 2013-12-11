package register;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.UnknownHostException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Set;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

/**
 * Servlet implementation class RegisterUser
 */
@WebServlet("/RegisterUser")
public class RegisterUser extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private MongoClient mongoClient = null;
    private DB db = null;
    private DBCollection coll = null;
    /**
     * @throws UnknownHostException 
     * @see HttpServlet#HttpServlet()
     */
    public RegisterUser() throws UnknownHostException {
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
		response.setContentType("text/plain");
		PrintWriter out = response.getWriter();
		if (!exists(request)){
			DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
			Date date = new Date();
			BasicDBObject user = new BasicDBObject("name", request.getParameter("name")).
											append("adress", request.getParameter("adress")).
											append("dateIn", dateFormat.format(date)).
											append("email", request.getParameter("email")).
											append("password", request.getParameter("password"));
			coll.insert(user);
			System.out.println("Nuevo usuario insertado");
			out.write("true");
		}
		else{
			System.out.println("Existe");
			out.write("false");
		}
	}
	
	protected boolean exists(HttpServletRequest request){
		Pattern email = Pattern.compile(request.getParameter("email").toLowerCase(), Pattern.CASE_INSENSITIVE);
		BasicDBObject query = new BasicDBObject("email", email);
		DBObject myDoc = coll.findOne(query);
		if (myDoc != null)
			return true;
		return false;
	}

}

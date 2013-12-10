package modify;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.UnknownHostException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bson.types.ObjectId;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

/**
 * Servlet implementation class ModifyUser
 */
@WebServlet("/ModifyUser")
public class ModifyUser extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private MongoClient mongoClient = null;
    private DB db = null;
    private DBCollection coll = null;
       
    /**
     * @throws UnknownHostException 
     * @see HttpServlet#HttpServlet()
     */
    public ModifyUser() throws UnknownHostException {
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
		
		BasicDBObject newDocument = new BasicDBObject();
		newDocument.append("$set", new BasicDBObject().append("name", request.getParameter("name"))
													.append("adress", request.getParameter("adress"))
													.append("email", request.getParameter("email"))
													.append("password", request.getParameter("password"))
							);
		
		ObjectId id = new ObjectId(request.getParameter("id"));

		BasicDBObject query = new BasicDBObject("_id", id);
		DBObject myDoc = coll.findOne(query);
		if (myDoc != null){
			System.out.println("EncontradoID para modificar");
			coll.update(query, newDocument);
			out.write(request.getParameter("name").toString());
		}
		else{
			System.out.println("No encontradoID para modificar");
			out.write("false");
		}
	}

}

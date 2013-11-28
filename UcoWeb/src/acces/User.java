package acces;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

/**
 * Servlet implementation class User
 */
@WebServlet("/User")
public class User extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public User() {
        super();
        // TODO Auto-generated constructor stub
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
		
		String email = request.getParameter("email");
		String password = request.getParameter("password");
		
		System.out.println(email);
		System.out.println(password);
		
		Document doc = Jsoup.connect("http://localhost:8080/UcoWeb/web/menu.html").get();
		
		Elements scripts = doc.getElementsByTag("script");
		Elements links = doc.getElementsByTag("link");
		String container = doc.getElementsByClass("container").html();
		
		String url = "http://localhost:8080/UcoWeb/web/";
		
		JSONObject obj = new JSONObject();
		JSONArray lstScript = new JSONArray();
		JSONArray lstLink = new JSONArray();
		
		try {
			for (Element sc : scripts)
				lstScript.put(url+sc.attr("src"));
			for (Element lk : links)
				lstLink.put(url+lk.attr("href"));
			obj.put("user", "Usuario");
			obj.put("body", container.toString());
			obj.put("scripts", lstScript);
			obj.put("links", lstLink);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		response.setContentType("application/json");
		response.getWriter().write(obj.toString());
		
		
		
	}

}

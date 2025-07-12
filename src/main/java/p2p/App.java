package p2p;

import p2p.controller.FileController;

import java.io.IOException;
import org.apache.commons.io.IOUtils;

/**
 * Hello world!
 */
public class App {
    public static void main(String[] args) {
        try{
            FileController fileController = new FileController(8080);
            fileController.start();
            System.out.println("Server started @ 8080");
            Runtime.getRuntime().addShutdownHook(new Thread(()->{
                System.out.println("Shutting down the server!");
                fileController.stop();
            }));
            System.out.println("Press enter to stop!");
            System.in.read();
            fileController.stop();
        } catch (Exception e) {
            System.out.println("Failed to start @ port 8080! "+ e.getMessage());
        }
    }
}

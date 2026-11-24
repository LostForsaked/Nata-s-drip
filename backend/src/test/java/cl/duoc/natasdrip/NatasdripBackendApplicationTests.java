package cl.duoc.natasdrip;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Requiere MySQL y las variables DB_PASSWORD y JWT_SECRET")
class NatasdripBackendApplicationTests {

	@Test
	void contextLoads() {
	}
}
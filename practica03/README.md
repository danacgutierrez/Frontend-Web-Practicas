1\. ¿Hizo falta una base de datos real para probar la regla de negocio? ¿Qué dice eso sobre para qué sirve el patrón Repository?

No, la regla de negocio se probo usando `InMemoryPrestamoRepository`, la cual solo guarda datos en un 'Map' en memoria. Para eso sirve el patron Repository, separa las reglas de negocio del lugar donde se guardan los datos, por lo que podemos probar estas reglas sin necesidad de levanter una base de datos o alguna conexion externa.

2\. El Service recibe el repositorio como Repository<Prestamo>, no InMemoryPrestamoRepository. ¿Qué se rompía si usaban la clase concreta?

Si el constructor pidiera la clase concreta, el `Service` quedaría acoplado a esa implementación específica. Cambiar a otra base de datos implicaría modificar la el constructor del `Service`, rompiendo el principio de que la capa de dominio no debe saber nada de infraestructura.

3\. Si cambiaran el Map en memoria por una base de datos real, ¿cuántos archivos tocarían? ¿Por qué tan pocos?

En este caso, solo 2. Primero seria crear una clase nueva que implemente PrestamoRepository y con esto cambiar la linea en el main.ts donde instanciamos el repositorio.




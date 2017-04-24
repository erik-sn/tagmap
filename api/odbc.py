from contextlib import contextmanager


import pyodbc

CONN_STRING = """
Driver={PI ODBC Driver};Server=%s;Trusted Connection=Yes;Provider Type=PIOLEDB;
Initial Catalog=NuGreen;Provider String={Data Source=%s; Integrated Security=SSPI};
autocommit=True;
"""


@contextmanager
def get_pi_conn(server, data_source):
    """
    Retrieve a connection object to PI. The @contextmanager helps
    manage the connection object so it will be closed automatically if the manual
    close is not reached.
    :return: yield the connection as a generator
    """
    connection = None
    try:
        conn_string = CONN_STRING % (server, data_source)
        connection = pyodbc.connect(conn_string, autocommit=True)
        yield connection
    finally:
        if connection:
            connection.close()

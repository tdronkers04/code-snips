import { useState, useEffect } from "react";
import { useAuth, UserButton } from "@clerk/clerk-react";
import Note from "./Note";
import NewNote from "./NewNote";

function Notes() {
  const { getToken } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const response = await fetch("http://localhost:8000/notes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            mode: "cors",
          },
        });

        if (!response.ok) {
          throw new Error(
            "Something went wrong fetching data from the server."
          );
        }

        const result = await response.json();
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else if (typeof err === "string") {
          setError({ message: err } as Error);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [getToken]);

  if (loading) {
    return <div>"Loading..."</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-screen h-full text-zinc-50">
      <div className="w-[98%] h-[50px] flex justify-end items-end">
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="flex flex-col justify-start items-center">
        <h1 className="py-4 text-3xl text-purple-500">Code Notes</h1>
        <ul>
          {data.map((item: any) => {
            // ^ update this any type
            return <Note key={item.id} code={item.code} />;
          })}
        </ul>
        <div>
          <NewNote setDataHook={setData} />
        </div>
      </div>
    </div>
  );
}

export default Notes;

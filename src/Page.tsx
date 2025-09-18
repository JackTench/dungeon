import SizeSelector from "./components/SizeSelector";

export default function Page() {
  return (
    <div>
      <div>
        <h2>Control Panel</h2>
        <SizeSelector />
      </div>
      <div>
        <button>Generate</button>
        <p>Placeholder for board.</p>
      </div>
    </div>
  );
}

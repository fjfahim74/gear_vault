export default function TestErrorPage() {
    throw new Error("MongoTopologyClosedError: Topology is closed");
}
"use client";

export default function TestScrollPage() {
  return (
    <article className="max-w-5xl mx-auto py-12 px-4 sm:px-8 lg:px-0">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight text-center">
        Test Scroll Arrow Functionality
      </h1>
      
      <div className="prose prose-lg prose-indigo max-w-none mb-12">
        <h2>Wide Table Test</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full mt-10 bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="bg-indigo-50 text-indigo-900 px-6 py-5 font-bold text-lg text-left">Column 1 with Long Header</th>
                <th className="bg-indigo-50 text-indigo-900 px-6 py-5 font-bold text-lg text-left">Column 2 with Very Long Header</th>
                <th className="bg-indigo-50 text-indigo-900 px-6 py-5 font-bold text-lg text-left">Column 3 with Extremely Long Header</th>
                <th className="bg-indigo-50 text-indigo-900 px-6 py-5 font-bold text-lg text-left">Column 4 with Super Long Header</th>
                <th className="bg-indigo-50 text-indigo-900 px-6 py-5 font-bold text-lg text-left">Column 5 with Ultra Long Header</th>
                <th className="bg-indigo-50 text-indigo-900 px-6 py-5 font-bold text-lg text-left">Column 6 with Mega Long Header</th>
                <th className="bg-indigo-50 text-indigo-900 px-6 py-5 font-bold text-lg text-left">Column 7 with Giga Long Header</th>
                <th className="bg-indigo-50 text-indigo-900 px-6 py-5 font-bold text-lg text-left">Column 8 with Final Header</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd:bg-gray-50 hover:bg-indigo-50/40 transition-colors duration-150">
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">Some very long content here that should extend beyond viewport</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">More content to make table wide</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">Additional content for width</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">Even more content here</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">Continue adding content</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">Keep making it wider</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">More and more content</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">Final column content</td>
              </tr>
              <tr className="odd:bg-gray-50 hover:bg-indigo-50/40 transition-colors duration-150">
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">Row 2 content</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">Row 2 content</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">Row 2 content</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">Row 2 content</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">Row 2 content</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">Row 2 content</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">Row 2 content</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">Row 2 content</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h2>Another Wide Table Test</h2>
        <div className="overflow-x-auto">
          <table style={{width: '1500px'}} className="bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="bg-indigo-50 text-indigo-900 px-6 py-5 font-bold text-lg text-left">Fixed Width Table Col 1</th>
                <th className="bg-indigo-50 text-indigo-900 px-6 py-5 font-bold text-lg text-left">Fixed Width Table Col 2</th>
                <th className="bg-indigo-50 text-indigo-900 px-6 py-5 font-bold text-lg text-left">Fixed Width Table Col 3</th>
                <th className="bg-indigo-50 text-indigo-900 px-6 py-5 font-bold text-lg text-left">Fixed Width Table Col 4</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">This table has a fixed width of 1500px</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">So it should definitely scroll</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">And show the arrow</td>
                <td className="px-6 py-5 border-t border-gray-200 text-gray-800 align-middle text-base">If it's working correctly</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
}